// src/pages/ContactPage.tsx
import React, { useState } from 'react';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import { MapPin, Phone, Mail as MailIcon, Linkedin, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  // estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // atualiza campos de texto
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // envia para o Formspree
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = 'https://formspree.io/f/mzzrvgan'; // <-- endpoint

    // monta FormData só com texto
    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v as string));

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: payload,
      });
      if (res.ok) {
        setFormSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setFormSubmitted(false), 5000);
      } else {
        alert('Falha no envio. Tente novamente mais tarde.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro no envio. Tente novamente.');
    }
  };

  return (
    <div>
      {/* Banner de topo */}
      <Hero
        topImage={{
          src: '/assets/logosemf.png',
          alt: 'Logo ISM Agropecuária',
          className: 'mx-auto mb-4 w-24 h-auto',
        }}
        title="Entre em Contato"
        subtitle="Estamos à disposição para atender suas necessidades e responder suas dúvidas"
        backgroundClass="bg-[url('/assets/boipagecontato.jpeg')] bg-cover bg-center bg-no-repeat bg-black/40 bg-blend-darken"
      />

      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Coluna 1: Informações */}
            <div>
              <SectionTitle
                title="Informações de Contato"
                subtitle="Estamos prontos para atender você pelos seguintes canais"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Endereço */}
                <div className="bg-neutral-light p-6 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Endereço</h3>
                      <p className="text-accent">
                        Rua Delfim Moreira, 20<br />
                        Centro - Frutal/MG<br />
                        CEP: 38200-098
                      </p>
                    </div>
                  </div>
                </div>
                {/* Telefone */}
                <div className="bg-neutral-light p-6 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Phone className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Telefone</h3>
                      <p className="text-accent">(34) 3421-0008</p>
                    </div>
                  </div>
                </div>
                {/* Email */}
                <div className="bg-neutral-light p-6 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <MailIcon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Email</h3>
                      <p className="text-accent">contato@ismagro.com.br</p>
                    </div>
                  </div>
                </div>
                {/* Horário */}
                <div className="bg-neutral-light p-6 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Clock className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Horário</h3>
                      <p className="text-accent">
                        Segunda a Sexta<br />
                        07:30 às 18:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mapa */}
              <div className="rounded-lg overflow-hidden shadow-lg h-[300px] relative mb-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.644263567326!2d-48.943640525929624!3d-20.023439681386105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94bcb1229a78810d%3A0x63daa05e68b7b1a0!2sR.%20Delfim%20Moreira%2C%2020%20-%20Frutal%2C%20MG%2C%2038200-098!5e0!3m2!1spt-BR!2sbr!4v1746822279283!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização ISM Agropecuária"
                />
              </div>

              {/* Trabalhe Conosco */}
              <div className="bg-primary text-white p-8 rounded-lg">
                <h3 className="text-2xl font-display mb-4">Trabalhe Conosco</h3>
                <p className="text-neutral-light mb-6">
                  Estamos sempre em busca de talentos para compor nossa equipe. Envie seu currículo para:
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://www.linkedin.com/company/ism-agropecu%C3%A1ria/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('recrutamento@ismagro.com.br');
                      alert('Email copiado para a área de transferência!');
                    }}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <MailIcon size={20} />
                    <span>Copiar Email</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Coluna 2: Formulário */}
            <div>
              <SectionTitle
                title="Envie uma Mensagem"
                subtitle="Preencha o formulário abaixo para entrar em contato conosco"
              />

              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="bg-neutral-light p-8 rounded-lg shadow-md"
              >
                {formSubmitted && (
                  <div className="mb-6 p-4 bg-success bg-opacity-20 border border-success rounded-md">
                    <p className="text-success font-medium">
                      Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.
                    </p>
                  </div>
                )}

                {/* Nome e Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-primary font-medium mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-primary font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Telefone e Assunto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="phone" className="block text-primary font-medium mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-primary font-medium mb-2">
                      Assunto
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="Informações">Informações</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Parcerias">Parcerias</option>
                      <option value="Trabalhe Conosco">Trabalhe Conosco</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                {/* Mensagem */}
                <div className="mb-6">
                  <label htmlFor="message" className="block text-primary font-medium mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Enviar */}
                <div className="flex justify-end">
                  <button type="submit" className="btn-primary text-lg px-8">
                    Enviar Mensagem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
